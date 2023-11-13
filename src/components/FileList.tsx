import { AuthContext } from "@/context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FileList = () => {
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [documentIdList, setDocumentIdList] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // creating main socket connection
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    socket.once("connection", onConnect);

    return () => {
      socket.off("connection", onConnect);
    };
  }, []);

  useEffect(() => {
    function onGetDocumentIdList(idList: string[]) {
      setDocumentIdList(idList);
    }

    socket.emit("fetch-document-id-list");
    socket.on("send-document-id-list", onGetDocumentIdList);

    return () => {
      socket.off("send-document-id-list", onGetDocumentIdList);
    };
  }, [socket]);

  const handleCreateNewFile = () => {
    const documentId = uuidv4();
    navigate(`/file/${documentId}`);
  };

  const openFileInEditor = (documentId: string) => {
    navigate(`/file/${documentId}`);
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h4>Welcome, {username}</h4>
        <Button onClick={() => logout()} variant="link">
          Log out
        </Button>
      </div>
      <Button
        onClick={handleCreateNewFile}
        variant="outline"
        style={{ marginTop: 16, width: "100%" }}
      >
        Create new JSON file
      </Button>
      {documentIdList && (
        <div className="container mx-auto py-10">
          <Table>
            <TableCaption>List of JSON files fetched from MongoDB</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>File name</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentIdList.map((documentIdItem) => {
                return (
                  <TableRow>
                    <TableCell className="text-left">{documentIdItem}</TableCell>
                    <TableCell className="text-left">
                      <Button onClick={() => openFileInEditor(documentIdItem)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FileList;
