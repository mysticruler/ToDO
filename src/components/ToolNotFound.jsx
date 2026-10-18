import React from "react";
export default function ToolNotFound({onBack}){return <div className="tool-page"><div className="converter-card not-found"><p className="eyebrow">404</p><h1>Tool not found</h1><p className="sub">That route is not registered in the toolbox.</p><button className="primary" onClick={onBack}>Back to tools</button></div></div>}
