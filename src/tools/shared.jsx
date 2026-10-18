import React from "react";
import { ArrowLeft, Check, LoaderCircle } from "lucide-react";
export function ToolLayout({title,description,onBack,children,badge}){return <div className="tool-page"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Back to tools</button><main className="tool-shell"><div className="tool-heading"><p className="eyebrow">ALL IN ONE TOOLBOX</p><h1>{title}</h1><p className="sub">{description}</p>{badge&&<span className="tool-badge">{badge}</span>}</div>{children}</main></div>}
export function Button({children,variant="primary",...props}){return <button className={`${variant} tool-button`} {...props}>{children}</button>}
export function Card({children,className=""}){return <section className={`card tool-card ${className}`}>{children}</section>}
export function Input({label,...props}){return <label className="tool-field">{label}<input {...props}/></label>}
export function Toast({message,onClose}){if(!message)return null;return <div className="toast" role="status"><Check size={16}/>{message}<button onClick={onClose} aria-label="Close notification">×</button></div>}
export function EmptyState({title,description}){return <div className="empty tool-empty"><div>✦</div><h3>{title}</h3><p>{description}</p></div>}
export function LoadingSpinner({label="Loading..."}){return <div className="loading"><LoaderCircle className="spin" size={18}/>{label}</div>}
export function ErrorMessage({children}){return <p className="converter-error" role="alert">{children}</p>}
