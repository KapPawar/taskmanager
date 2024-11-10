import React from "react";

function IconChart({ strokeColor = "black" }: { strokeColor?: string }) {
  return (
    <svg width="22"
    height="20"
    viewBox="0 0 22 25"
    fill="none">
<path d="M21 21H6.2C5.07989 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V3M7 15L12 9L16 13L21 7" stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"/>
</svg>
  );
}

export default IconChart;
