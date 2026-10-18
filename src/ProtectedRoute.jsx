import React from "react";
export default function ProtectedRoute({ loggedIn, path, children }) {
  if (!loggedIn) {
    window.location.replace(`/login?redirect=${encodeURIComponent(path)}`);
    return <div className="tool-page"><div className="converter-card"><p className="sub">Checking access...</p></div></div>;
  }
  return children;
}
