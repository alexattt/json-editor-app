import { useContext, useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import { Button } from "@/components/ui/button";
import { socket } from "../socket";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/ext-language_tools";
import { useNavigate, useParams } from "react-router-dom";
import { formatDateTime } from "@/helpers/datetime-formatter.helper";
import { AuthContext } from "@/context/AuthContext";

const sampleJsonObj = {
  status: "Creating or loading file...",
};

const JsonEditor = () => {
  const { username } = useContext(AuthContext);

  const editorRef = useRef<any>();
  const { id: documentId } = useParams();
  const navigate = useNavigate();

  const [lastSavedDate, setLastSavedDate] = useState<Date>();
  const [jsonObjValue, setJsonObjValue] = useState<any>(JSON.stringify(sampleJsonObj, null, "\t"));
  const [usersEditingFile, setUsersEditingFile] = useState<string[]>([]);

  useEffect(() => {
    function loadDocumentHandler(document: any) {
      setJsonObjValue(document);
      socket.emit("send-username", username);
    }

    socket.once("load-document", loadDocumentHandler);

    socket.emit("create-new-or-get-document", documentId);

    return () => {
      socket.off("load-document", loadDocumentHandler);
    };
  }, [socket, documentId]);

  useEffect(() => {
    function onReceiveChanges(jsonData: any) {
      handleJsonFileContentChange(jsonData);
    }

    socket.on("receive-changes", onReceiveChanges);

    return () => {
      socket.off("receive-changes", onReceiveChanges);
    };
  }, [socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("save-document", { data: jsonObjValue, documentId: documentId });
      setLastSavedDate(new Date());
    }, 7000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, jsonObjValue]);

  useEffect(() => {
    function onUpdateUserList(userList: string[]) {
      setUsersEditingFile(userList.filter((editorUsername) => editorUsername !== username));
    }

    socket.on("update-user-list", onUpdateUserList);

    return () => {
      socket.off("update-user-list", onUpdateUserList);
    };
  }, [socket]);

  const onChange = (value: string) => {
    socket.emit("update-json", { jsonData: value, documentId: documentId });
    handleJsonFileContentChange(value);
  };

  const handleJsonFileContentChange = (content: any) => {
    setJsonObjValue(content);
  };

  const handleBackBtnClick = () => {
    navigate("/file-list");
    socket.emit("leave-file");
  };

  const downloadFile = () => {
    const blob = new Blob([jsonObjValue], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = `json-file-${documentId}` + ".json";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const usersInFile = usersEditingFile.length > 0 ? `and ${usersEditingFile.join(", ")}` : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "32px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", width: "70vw" }}>
        <Button onClick={handleBackBtnClick}>Back</Button>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <p>Last saved: {formatDateTime(lastSavedDate ?? new Date())}</p>
          <Button onClick={downloadFile}>Download current file</Button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <h3>Currently in this file:</h3>
        <p>
          You({username}) {usersInFile}
        </p>
      </div>
      <AceEditor
        ref={editorRef}
        placeholder="Write your JSON here"
        mode="json"
        theme="one_dark"
        name="json-editor"
        onChange={onChange}
        fontSize={14}
        width="70vw"
        value={jsonObjValue}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          useWorker: false,
          showPrintMargin: false,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default JsonEditor;
