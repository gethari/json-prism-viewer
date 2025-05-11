
import { useToast } from '@/hooks/use-toast';

/**
 * Opens a new window with expanded diff view
 */
export const openExpandedDiffView = (originalJson: string, modifiedJson: string, toastFn: ReturnType<typeof useToast>['toast']) => {
  const newWindow = window.open('', '_blank');
  if (!newWindow) {
    toastFn({
      variant: "destructive",
      title: "Popup Blocked",
      description: "Please allow popups for this site to open the viewer in a new tab.",
    });
    return;
  }
  
  newWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>JSON Diff - Expanded View</title>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          overflow: hidden; 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        #container { width: 100vw; height: 100vh; }
        .header {
          padding: 10px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header h1 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 500;
        }
        .btn {
          padding: 8px 12px;
          background: #e9ecef;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .btn:hover {
          background: #dee2e6;
        }
        .info {
          font-size: 0.9rem;
          color: #666;
        }
      </style>
      <link rel="stylesheet" data-name="vs/editor/editor.main" 
            href="https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs/editor/editor.main.css">
    </head>
    <body>
      <div class="header">
        <div>
          <h1>JSON Diff - Expanded View</h1>
          <span class="info">Close this tab and return to the main application to modify JSON content</span>
        </div>
        <button class="btn" onclick="window.close()">Close</button>
      </div>
      <div id="container"></div>
      <script>var require = { paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs' } };</script>
      <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs/loader.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs/editor/editor.main.nls.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs/editor/editor.main.js"></script>
      <script>
        require(['vs/editor/editor.main'], function() {
          monaco.editor.createDiffEditor(document.getElementById('container'), {
            automaticLayout: true,
            theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light',
            readOnly: true,
            renderSideBySide: true
          }).setModel({
            original: monaco.editor.createModel(${JSON.stringify(originalJson)}, 'json'),
            modified: monaco.editor.createModel(${JSON.stringify(modifiedJson)}, 'json')
          });
        });
      </script>
    </body>
    </html>
  `);
  newWindow.document.close();
};
