function RoundButtonSVG({ height = 62, width = 62 }) {
  return (
    <svg
      className="circle"
      height={height}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <ellipse
          className="background"
          ry={height / 2 - 2}
          rx={height / 2 - 2}
          cy={height / 2}
          cx={height / 2}
          strokeWidth="2"
        />
        <ellipse
          className="foreground"
          ry={height / 2 - 2}
          rx={height / 2 - 2}
          cy={height / 2}
          cx={height / 2}
          strokeWidth="2"
        />
        <line
          x1={height / 2 - 10}
          y1={height / 2}
          x2={height / 2 + 10}
          y2={height / 2}
          className="line"
        />
        <line
          x1={height / 2 - 10}
          y1={height / 2}
          x2={height / 2 + 10}
          y2={height / 2}
          className="line line2"
        />
      </g>
    </svg>
  );
}

export default RoundButtonSVG;
