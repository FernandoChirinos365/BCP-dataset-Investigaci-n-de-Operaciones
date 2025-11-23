import React, { useState } from "react";
import { useData } from "../../context/DataContext";

/**
 * OptimizeButton:
 * - Si hay backend en /api/optimize hará POST con { data, params }
 * - Si no responde, ejecuta optimizeLocal(...) y guarda resultado en context
 */
export default function OptimizeButton({ params }) {
  const { excelData, setOptimizationResult } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const optimizeLocal = (data, params) => {
    // ---- SIMPLE HEURISTIC MILP-LIKE (client-side) ----
    // Supuestos:
    // - data: array of rows with columns: fecha_transaccion (YYYYMMDD or Date), codigo_cajero, tipo_cajero, saldo_inicial, demanda, abastecimiento, saldo_final
    // - params: { horizonDays, minStockRatio, costA, costB }
    // This is a heuristic fallback: builds per-cajero per-date plan for horizon last N dates.
    const parseDate = (v) => {
      if (!v) return null;
      if (typeof v === "number") v = String(v);
      if (v instanceof Date) return v;
      const s = String(v);
      if (s.length === 8) {
        const y = +s.slice(0,4), m = +s.slice(4,6) - 1, d = +s.slice(6,8);
        return new Date(y,m,d);
      }
      const d = new Date(s);
      return isNaN(d) ? null : d;
    };

    // aggregate demand per cajero x date
    const map = new Map(); // key: cajero|dateStr -> { demand, saldo_inicial, tipo }
    const dateSet = new Set();
    for (const r of data) {
      const date = parseDate(r.fecha_transaccion);
      if (!date) continue;
      const dateStr = date.toISOString().slice(0,10);
      dateSet.add(dateStr);
      const key = `${r.codigo_cajero}|||${dateStr}`;
      const entry = map.get(key) || { demand:0, saldo_inicial: r.saldo_inicial || 0, tipo: r.tipo_cajero || "A" };
      entry.demand += Math.max(0, Number(r.demanda || 0)); // clip negative demands for simplicity
      map.set(key, entry);
    }
    // take last N dates ascending
    const allDates = Array.from(dateSet).sort();
    const N = Math.max(1, Math.min(params.horizonDays || 7, allDates.length));
    const horizon = allDates.slice(-N);

    // gather cajero ids
    const cajeroSet = new Set();
    for (const k of map.keys()) {
      cajeroSet.add(k.split("|||")[0]);
    }
    const cajeros = Array.from(cajeroSet);

    const CAP = { A: 1000000, B: 1300000 };
    const COST = { A: params.costA ?? 0.001, B: params.costB ?? 0.0015 };
    const MIN_RATIO = params.minStockRatio ?? 0.2;
    const DAYS_ALLOWED = { A: [0,1,4], B: [0,2,3] }; // Mon=0,Tue=1,...

    const results = [];
    let totalCost = 0;

    for (const caj of cajeros) {
      // pick S0 as first available saldo_inicial for first horizon day; fallback 0
      let S_prev = null;
      // tipo
      let tipo = "A";
      for (const d of horizon) {
        const key = `${caj}|||${d}`;
        const e = map.get(key);
        if (e) { S_prev = e.saldo_inicial; tipo = e.tipo || tipo; break; }
      }
      if (S_prev == null) S_prev = 0;
      const cap = CAP[tipo] || 1000000;
      const minStock = MIN_RATIO * cap;

      for (let ti = 0; ti < horizon.length; ti++) {
        const dstr = horizon[ti];
        const key = `${caj}|||${dstr}`;
        const e = map.get(key);
        const D = e ? e.demand : 0;
        const dt = new Date(dstr);
        const dow = dt.getDay(); // 0..6

        let X = 0;
        let B = 0;
        // if after demand current stock < minStock we try to refill on that day if allowed
        const projected_after = S_prev - D;
        if (projected_after < minStock) {
          // only allow refill on allowed weekday
          if ((DAYS_ALLOWED[tipo] || []).includes(dow)) {
            // amount required to get to minStock after demand: need X such that S_prev + X - D >= minStock => X >= minStock - (S_prev - D)
            const required = Math.max(0, minStock - projected_after);
            // can only add up to free capacity
            const freeCap = Math.max(0, cap - S_prev);
            X = Math.min(required, freeCap);
            if (X > 0) B = 1;
          } else {
            // cannot refill today -> we allow negative until next allowed day (heuristic)
            X = 0; B = 0;
          }
        }
        // limit S_prev after refill and demand
        const Y = Math.max(0, Math.min(cap, S_prev + X - D));
        totalCost += (COST[tipo] || 0.001) * X;
        results.push({
          codigo_cajero: Number(caj),
          fecha: dstr,
          tipo_cajero: tipo,
          X_it: Number(X),
          B_it: Number(B),
          Y_it: Number(Y),
          D_it: Number(D)
        });
        // next iteration
        S_prev = Y;
      }
    }

    return { cost_total: Number(totalCost.toFixed(2)), results };
  };

  const onClick = async () => {
    setLoading(true);
    setError(null);

    try {
      // try backend first
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: excelData, params })
      });
      if (res.ok) {
        const json = await res.json();
        setOptimizationResult(json);
        setLoading(false);
        return;
      }

      // fallback to local heuristic
      const localResult = optimizeLocal(excelData, params);
      setOptimizationResult(localResult);
      setLoading(false);
    } catch (err) {
      // network error -> fallback local
      console.warn("Backend optimize failed, using local heuristic", err);
      const localResult = optimizeLocal(excelData, params);
      setOptimizationResult(localResult);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={onClick}
        className="optimize-button"
        disabled={loading}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          background: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Optimizando..." : "Obtener Optimización"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </>
  );
}
