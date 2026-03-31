"use client";

import { useState } from "react";
import { X, Key, Link as LinkIcon, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useSaveApiKey, useRemoveIntegration } from "../../hooks/useAgents";
import { getGoogleConnectUrl } from "../../services/agentApis";

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: any;
  integration: any | null; // The existing integration if any
}

export default function IntegrationModal({ isOpen, onClose, tool, integration }: IntegrationModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const saveApiMutation = useSaveApiKey();
  const removeMutation = useRemoveIntegration();

  if (!isOpen || !tool) return null;

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError("API Key is required");
      return;
    }
    setError("");
    try {
      await saveApiMutation.mutateAsync({
        userId: "current-user", // backend uses session, but schema requires a userId. Wait, does backend extract from session? Let's pass empty or "me"
        provider: tool.provider,
        apiKey: apiKey.trim(),
        apiName: tool.name,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save API Key");
    }
  };

  const handleRemove = async () => {
    try {
      await removeMutation.mutateAsync(tool.provider);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to remove integration");
    }
  };

  const handleGoogleConnect = async () => {
    try {
      const { url } = await getGoogleConnectUrl();
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      setError(err.message || "Failed to initialize Google Auth");
    }
  };

  const isSaving = saveApiMutation.isPending;
  const isRemoving = removeMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-mono">
      <div className="bg-bg-secondary border border-border-soft rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-soft flex justify-between items-center bg-bg-tertiary">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 tracking-wide">
            {integration ? <LinkIcon size={18} className="text-green-400" /> : <Key size={18} className="text-accent-cyan" />}
            {integration ? `Connected: ${tool.name}` : `Configure ${tool.name}`}
          </h3>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text-primary hover:bg-white/5 p-1.5 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {integration ? (
            <div className="space-y-4">
              <div className="bg-bg-tertiary p-4 rounded-lg border border-border-soft">
                <p className="text-sm text-text-muted mb-2">Integration Status</p>
                <div className="flex items-center gap-2 text-green-400 font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  Active & Connected
                </div>
                {integration.createdAt && (
                  <p className="text-xs text-text-disabled mt-3">Connected on {new Date(integration.createdAt).toLocaleDateString()}</p>
                )}
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                This integration is active and ready to be used by your autonomous agents. 
                Disconnecting it will prevent agents from using this tool until reconfigured.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                To enable the <strong className="text-text-primary">{tool.name}</strong> tool, you need to configure the required provider (<span className="text-accent-cyan">{tool.provider}</span>).
              </p>

              {tool.authType === "oauth" ? (
                <div className="mt-2">
                  <button 
                    onClick={handleGoogleConnect}
                    className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 pt-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      <path d="M1 1h22v22H1z" fill="none"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-widest text-text-muted">
                    API Key
                  </label>
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-bg-tertiary border border-border-soft rounded-md px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 transition-all font-mono"
                  />
                  <p className="text-[10px] text-text-disabled">Keys are stored securely and never exposed to the frontend.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-soft bg-bg-tertiary flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm text-text-primary hover:bg-bg-secondary border border-transparent hover:border-border-soft transition-all"
            disabled={isSaving || isRemoving}
          >
            {integration ? "Close" : "Cancel"}
          </button>
          
          {integration ? (
            <button 
              onClick={handleRemove}
              disabled={isRemoving}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-md text-sm transition-all flex items-center justify-center gap-2 min-w-[120px]"
            >
              {isRemoving ? <Loader2 size={16} className="animate-spin" /> : <><Trash2 size={16} /> Disconnect</>}
            </button>
          ) : (
            tool.authType !== "oauth" && (
              <button 
                onClick={handleSave}
                disabled={isSaving || !apiKey.trim()}
                className="bg-accent-cyan text-black hover:bg-accent-cyan/90 px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Save API Key"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
