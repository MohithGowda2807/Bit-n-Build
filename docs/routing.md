# Routing & Optimization Mathematical Specification

## 1. Great-Circle Distance (Haversine Formula)

To measure distance along the Earth's spherical surface between point $(\phi_1, \lambda_1)$ and $(\phi_2, \lambda_2)$:
$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)$$
$$c = 2 \cdot \operatorname{atan2}\left(\sqrt{a}, \sqrt{1 - a}\right)$$
$$d = R \cdot c$$
Where $R = 6,371.0088\text{ km}$. Nautical miles are derived via:
$$d_{\text{NM}} = \frac{d_{\text{km}}}{1.852}$$

---

## 2. A* Grid Navigation

The ocean is discretized into a coordinate grid with cell resolution $\Delta = 0.5^\circ$.
For node $n$, the total evaluation function is:
$$f(n) = g(n) + h(n)$$
- $g(n)$: Accumulated geodesic distance from origin to node $n$.
- $h(n)$: Haversine distance heuristic from node $n$ to destination.

Movement directions:
- Cardinal (N, S, E, W): Step cost factor = $1.0$.
- Diagonal (NE, NW, SE, SW): Step cost factor = $\sqrt{2} \approx 1.4142$.

---

## 3. Hydrodynamic Fuel Consumption Model

Marine vessels experience hydrodynamic resistance that scales cubically with vessel speed:
$$\text{speed\_factor} = \left(\frac{v_{\text{actual}}}{v_{\text{ref}}}\right)^3$$

Cargo displacement increases water draft and wet hull surface:
$$\text{cargo\_factor} = 1 + (c_{\text{cargo}} \times w_{\text{cargo}})$$

Total fuel consumed across voyage duration $T$:
$$\text{Fuel} = T \times \text{base\_rate} \times \text{speed\_factor} \times \text{cargo\_factor}$$

---

## 4. Multi-Objective Scoring

Candidates are normalized across physical dimensions $M \in \{\text{fuel}, \text{time}, \text{safety}, \text{environment}\}$:
$$\text{norm}(x) = \frac{x - \min(x)}{\max(x) - \min(x)}$$

Total penalty is calculated using user-specified normalized weights:
$$\text{penalty} = \sum_{m \in M} w_m \cdot \text{norm}(x_m)$$
$$\text{Score} = (1.0 - \text{penalty}) \times 100$$
The highest scored candidate is designated as the recommended route.
