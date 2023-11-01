import { Folder, FolderData } from "@/models/folder";
import { useEffect, useState } from "react";


interface FolderProps {
  spaceId: string
}

interface SelectedId {
  id: string,
  selected: boolean,
}


const Folders = (props: FolderProps) => {
  useEffect(()=> {
    fetch(`/api/folder/get?spaceId=${props.spaceId}`).then(async (data)=> {
      const folderData: FolderData = await data.json();
      setFolders(folderData.folders);
    })
  }, [])
  const [folders, setFolders] = useState<Array<Folder>>([]);
  return (
    <div>
    <table className="hover:table-fixed">
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {
          folders.map((folder, i)=> {
            return (
              <tr key={i}>
                <td>{folder.name}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
    </div>
  )
}

export default Folders;