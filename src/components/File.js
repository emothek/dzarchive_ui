import React, { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
//import FileViewer from 'react-file-viewer'

export default function File({ file }) {
  const [selectedDocs, setSelectedDocs] = useState([]);
  useEffect(() => {
    setSelectedDocs(Array.from([file]));
  }, []);

  return (
    <div>
      <DocViewer
        prefetchMethod="GET"
        pluginRenderers={DocViewerRenderers}
        documents={selectedDocs.map((f) => {
          return {
            uri: f,
          };
        })}
        config={{
          header: {
            disableHeader: true,
            disableFileName: true,
            retainURLParams: true,
          },
        }}
      />
    </div>
  );
}
