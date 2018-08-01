const SORT = {
  vertically: (a, b) => a.cy - b.cy, // sort vertically,
  horizontally: (a, b) => a.cx - b.cx // sort vertically
}

/**
 * @param {Array} groupOfCircles – An array of circle objects, including `cx`, `cy` (centers), and `r` (radius)
 */
function getPathFromCircleGroup(groupOfCircles = [], sorter = SORT.vertically, handleSize, v) {
  groupOfCircles.forEach((circ) => { circ.c = [circ.cx, circ.cy] })

  // get a path segment (curve + arc) between circles
  const pathFromCircles = (c, cn, i, len, down) => {
    let d = ''

    // Terminal circle should draw arc all the way around
    if (i === len - 1) {
      d += `C ${c.h[(down) ? 0 : 3]} ${c.h[(down) ? 2 : 1]} ${c.p[(down) ? 2 : 1]} `
      d += `A ${(down) ? c.r : c.r1}, ${(down) ? c.r : c.r1}, 0, 1, 0, ${c.p[(down) ? 3 : 0]} `

      if (!down) {
        d += 'Z'
      }

      return d
    }

    // Starting point, move to (M)
    if (down && i === 0) {
      d += `M ${c.p[0]} `
    }

    // Add a bezier cruve (C) and arc (A) between two circles
    d += `C ${c.h[(down) ? 0 : 3]} ${c.h[(down) ? 2 : 1]} ${c.p[(down) ? 2 : 1]} `
    d += `A ${(down) ? c.r : c.r1}, ${(down) ? c.r : c.r1}, 0, 0, 0, ${cn.p[(down) ? 0 : 3]} `

    return d
  }

  const circles = groupOfCircles.sort(sorter)
  let d = ''

  let pointsAndHandles = circles.map((circle, i) => {
    return (i === circles.length - 1) ? null
      : curvesBetweenCircles(circle.r, circles[i + 1].r, circle.c, circles[i + 1].c, handleSize, v)
  })

  pointsAndHandles = pointsAndHandles.filter((n) => n !== null && n !== undefined) // remove null & empty

  // draw left and right segments
  pointsAndHandles.forEach((c, i) => { d += pathFromCircles(c, pointsAndHandles[i + 1], i, pointsAndHandles.length, true) })
  pointsAndHandles.reverse().forEach((c, i) => { d += pathFromCircles(c, pointsAndHandles[i + 1], i, pointsAndHandles.length, false) })

  return d
}

/**
 * Based on Metaball script by SATO Hiroyuki
 * http://shspage.com/aijs/en/#metaball
 */
function curvesBetweenCircles(radius1, radius2, center1, center2, handleSize = 2.4, v = 0.5) {
  const HALF_PI = Math.PI / 2
  const d = dist(center1, center2)
  let u1 = 0
  let u2 = 0

  if (radius1 === 0 || radius2 === 0 || d <= Math.abs(radius1 - radius2)) {
    return null
  }

  if (d < radius1 + radius2) {
    u1 = Math.acos(
      (radius1 * radius1 + d * d - radius2 * radius2) / (2 * radius1 * d)
    )

    u2 = Math.acos(
      (radius2 * radius2 + d * d - radius1 * radius1) / (2 * radius2 * d)
    )
  }

  // All the angles
  const angleBetweenCenters = angle(center2, center1)
  const maxSpread = Math.acos((radius1 - radius2) / d)

  const angle1 = angleBetweenCenters + u1 + (maxSpread - u1) * v
  const angle2 = angleBetweenCenters - u1 - (maxSpread - u1) * v
  const angle3 = angleBetweenCenters + Math.PI - u2 - (Math.PI - u2 - maxSpread) * v
  const angle4 = angleBetweenCenters - Math.PI + u2 + (Math.PI - u2 - maxSpread) * v

  // All the points
  const p1 = getVector(center1, angle1, radius1)
  const p2 = getVector(center1, angle2, radius1)
  const p3 = getVector(center2, angle3, radius2)
  const p4 = getVector(center2, angle4, radius2)

  // Define handle length by the
  // distance between both ends of the curve
  const totalRadius = radius1 + radius2
  const d2Base = Math.min(v * handleSize, dist(p1, p3) / totalRadius)

  // Take into account when circles are overlapping
  const d2 = d2Base * Math.min(1, d * 2 / (radius1 + radius2))

  const r1 = radius1 * d2
  const r2 = radius2 * d2

  const h1 = getVector(p1, angle1 - HALF_PI, r1)
  const h2 = getVector(p2, angle2 + HALF_PI, r1)
  const h3 = getVector(p3, angle3 + HALF_PI, r2)
  const h4 = getVector(p4, angle4 - HALF_PI, r2)

  return {
    p: [p1, p2, p3, p4],
    h: [h1, h2, h3, h4],
    escaped: d > radius1,
    r: radius2,
    r1: radius1
  }
}

/**
 * Utils
 */

function dist([x1, y1], [x2, y2]) {
  return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5
}

function angle([x1, y1], [x2, y2]) {
  return Math.atan2(y1 - y2, x1 - x2)
}

function getVector([cx, cy], a, r) {
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

export {
  SORT,
  getPathFromCircleGroup,
  curvesBetweenCircles
}
