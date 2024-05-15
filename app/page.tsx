"use client"
import { Space, SpacesData } from '@/models/spaces';
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Folder, FolderData } from '@/models/folder';
import { List, ListData } from '@/models/list';
import SpacesList from './spaces/SpacesList';
import Dropdown from '@/components/ui/dropdown';
import FoldersList from './spaces/folders/FoldersList';
import ListTasks from './spaces/folders/lists/ListTasks';

interface SelectedId {
  id: string,
  selected: boolean,
}

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<SelectedId[]>([]);
  const [loading, setLoading] = useState(false);
  const [spaces, setSpaces] = useState<Array<Space>>([]);
  const [folders, setFolder] = useState<Array<Folder>>([]);
  const [lists, setList] = useState<Array<List>>([]);
  const [workspaceFolders, setWorkspaceFolders] = useState<{ [key: string]: Folder[] }>({});
  const [folderLists, setFolderLists] = useState<{ [key: string]: List[] }>({});
  const [listOnly, setListOnly] = useState<Array<List>>([]);

  useEffect(()=> {
    fetch("/api/spaces/get").then(async (data)=> {
      const spacesData: SpacesData = await data.json();
      setSpaces(spacesData.spaces);
    })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/folder/get');
      const folderData: FolderData = await response.json();
      setFolder(folderData.folders);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/list/get');
      const listData: ListData = await response.json();
      console.log('Lists data:', listData);
      setList(listData.lists);
    };
    fetchData();
  }, []);

  useEffect(() => {
    //setListOnly
    const fetchData = async () => {
      const response = await fetch('/api/list/getAll');
      const listData: ListData = await response.json();
      console.log('Lists data:', listData);
      setListOnly(listData.lists);
    };
    fetchData();
    
  }, []);
  

  const toggleSpaces = async (spaceId: string, index: number) => {
    if (!workspaceFolders[spaceId]) {
      const response = await fetch(`/api/folder/get?spaceId=${spaceId}`);
      const folderData: FolderData = await response.json();
  
      setWorkspaceFolders((prevWorkspaceFolders) => ({
        ...prevWorkspaceFolders,
        [spaceId]: folderData.folders,
      }));
    }
  
    setSpaces((prevSpaces) =>
      prevSpaces.map((space, i) => {
        const updatedSpace = { ...space };
  
        if (i === index) {
          updatedSpace.spacesOpen = !updatedSpace.spacesOpen;
        } else if (updatedSpace.spacesOpen) {
          updatedSpace.spacesOpen = false;
        }
  
        return updatedSpace;
      })
    );
  };
  
  const toggleFolders = async (folderId: string, index: number) => {
    if (!folderLists[folderId]) {
      const response = await fetch(`/api/list/get?folderId=${folderId}`);
      const listData: ListData = await response.json();
  
      setFolderLists((prevFolderLists) => ({
        ...prevFolderLists,
        [folderId]: listData.lists,
      }));
    }
  
    setFolder((prevFolders) =>
      prevFolders.map((folder, i) => {
        const updatedFolder = { ...folder };
  
        if (i === index) {
          updatedFolder.foldersOpen = !updatedFolder.foldersOpen;
        } else if (updatedFolder.foldersOpen) {
          updatedFolder.foldersOpen = false;
        }
  
        return updatedFolder;
      })
    );
  };
  
  


  return (
    <main className="flex min-h-screen flex-col items-center p-24">
    <div 
    // className="relative color flex place-items-center before:absolute before:h-[0px] before:w-[0px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-green-600 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#4fa79f] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"
    >
      <Image
        className="relative"
        src="/trajector.png"
        alt="Trajector Logo"
        width={360}
        height={80}
        priority
      />
    </div>

      <div className="items-center mb-32 grid text-center lg:w-full lg:mb-0 lg:text-left space-y-5">
        <Dropdown text='Spaces'>
          <SpacesList
            spaces={spaces}
            folders={folders}
            lists={lists}
            workspaceFolders={workspaceFolders}
            folderLists={folderLists}
            toggleSpaces={toggleSpaces}
            toggleFolders={toggleFolders}
          />
        </Dropdown>

        <Dropdown text='Folders'>
            <FoldersList foldersL={folders} folders={folders} lists={lists} folderLists={folderLists} toggleFolders={toggleFolders} />
        </Dropdown>

        {/* add list here */}
        <Dropdown text='Lists'>
          <ListTasks listsL={listOnly} lists={listOnly} listTasks={folderLists} toggleFolders={toggleFolders} />
          
        </Dropdown>

      </div>
    </main>
  )
}
