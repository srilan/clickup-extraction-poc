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
      {folders.map((folder, i)=> {
          return (
            <div key={i}>
              {folder.name}
            </div>
          )
        })
      }
    </div>
  )
}

export default Folders;