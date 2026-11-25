---
title: "地转风与热成风：为什么高空风比地面大"
pubDatetime: 2026-11-08T08:40:00+08:00
category: 气象学
tags:
  - geostrophic-wind
  - thermal-wind
  - synoptic
description: "从水平动量方程推出地转平衡，再由静力平衡与理想气体状态方程推出热成风关系——它的天气学含义比公式本身更有用。"
---

地面天气图上的风很少严格平行于等压线，但高空图上的风却几乎贴着等高线走。这中间的差别，可以用地转风与热成风两个关系解释清楚。

## 地转平衡

在自由大气中，水平气压梯度力与科氏力近似平衡：

$$
-f\mathbf{k}\times\mathbf{v}_g=-\frac{1}{\rho}\nabla p
$$

解出地转风：

$$
\mathbf{v}_g=\frac{1}{\rho f}\,\mathbf{k}\times\nabla p
$$

写成分量形式更直观（$f=2\Omega\sin\varphi$）：

$$
u_g=-\frac{1}{\rho f}\frac{\partial p}{\partial y},
\qquad
v_g=\frac{1}{\rho f}\frac{\partial p}{\partial x}
$$

在北半球，背风而立、低压在左——这就是白贝罗定律。用等压线间距估算风速时，常用

$$
V_g=\frac{1}{\rho f}\left|\nabla p\right|
$$

在 45°N、$\rho\approx1.2$ kg/m³、气压梯度 1 hPa/100 km 时，地转风约为 6.6 m/s。

## 热成风关系

把地转风关系对气压求导，并代入静力平衡 $\partial p/\partial z=-\rho g$ 与状态方程 $p=\rho R T$，得到

$$
\frac{\partial \mathbf{v}_g}{\partial \ln p}
=-\frac{R}{f}\,\mathbf{k}\times\nabla T
$$

这个式子的含义是：**两层地转风之差，正比于两层之间的平均水平温度梯度**。它不涉及地面摩擦，也不需要知道具体的风场，只要知道温度分布就能推断风随高度的变化。

几个直接推论：

| 温度分布           | 热成风方向     | 天气学含义             |
| ------------------ | -------------- | ---------------------- |
| 北冷南暖（北半球） | 西风           | 高空西风急流的基础     |
| 冷平流             | 风向随高度逆转 | 槽脊发展、冷空气南下   |
| 暖平流             | 风向随高度顺转 | 暖湿输送、降水潜势增加 |

## 一个数量估计

设 1000–500 hPa 之间的平均水平温度梯度为 5 K/1000 km，纬度 45°N：

$$
\Delta \mathbf{v}_g
=-\frac{R}{f}\mathbf{k}\times\nabla T\cdot\ln\frac{1000}{500}
\approx-\frac{287}{10^{-4}}\cdot 5\times10^{-6}\cdot 0.69
\approx 10\ \text{m·s}^{-1}
$$

即两层之间风速差约 10 m/s。若地面风接近 5 m/s，500 hPa 风速就在 15 m/s 量级：**风速随高度增加，主要不是「高空摩擦力小」，而是热成风在叠加**。

```python
import math

R, g = 287.0, 9.81
lat_deg = 45.0
f = 2 * 7.292e-5 * math.sin(math.radians(lat_deg))

dT_dy = 5.0 / 1000e3        # K/m，北冷南暖
delta_ln_p = math.log(1000 / 500)

du = R / f * dT_dy * delta_ln_p
print(f"f = {f:.2e} s^-1, 热成风 = {du:.1f} m/s")
```

## 回到地面

地面风偏离地转风，主要有三个原因：

1. **摩擦**：边界层内摩擦力使风穿越等压线指向低压，风速减小到地转风的 60%–70%；
2. **等压线弯曲**：曲率大时离心力不可忽略，需用梯度风修正；
3. **非地转运动**：锋面、急流入口区等强非平衡区域，地转近似本身失效。

> 记住热成风关系的用法：它把「温度场」和「风场垂直结构」直接连起来。看高空图时，温度槽往往比高度槽更超前，这正是槽脊发展的信号。
