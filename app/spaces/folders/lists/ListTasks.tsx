import React, { useState } from 'react';
import { Folder } from '@/models/folder';
import { List } from '@/models/list';
import { extract, extractByList } from '@/service/extract';
import { set } from 'date-fns';
// import ListTasks from './lists/ListTasks';

interface ListsTaskProps {
  listsL: List[];
  lists: List[];
  listTasks: { [key: string]: List[] };
  toggleFolders: (folderId: string, index: number) => void;  
}

const FoldersList: React.FC<ListsTaskProps> = ({ lists, listsL}) => {
  const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});

  const extractListData = async (listId: string, index: number, name?: string) => {
    setLoadingMap(prevLoadingMap => ({
      ...prevLoadingMap,
      [index]: true
    }));
    const data = await fetch('/api/export/lists', {
        method: 'POST',
        body: JSON.stringify({ id: listId }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const listData = await data.json();
    console.log(name)
    // Check if the response contains CSV data
    if (listData.message) {
        // Create an anchor element
        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(listData.message);
        anchor.download = `${name}_${new Date().toLocaleTimeString()}.csv`;
        // Trigger a click event on the anchor element to initiate download
        anchor.click();
    }

    setLoadingMap(prevLoadingMap => ({
      ...prevLoadingMap,
      [index]: false
    }));
  }

  return (
    <div>
      {listsL.map((list, index) => (
        
        <div key={index}>
          <div
            className="flex text-gray-600 w-full border-b overflow-hidden mt-32 md:mt-0 mb-5 mx-auto"
            // onClick={() => toggleFolders(list.id, index)}
          >
            <div className={`w-10 border-r px-2 transform transition duration-500 ease-in-out ${list.reportsOpen ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.75l-7.5-7.5-7.5 7.5" />
              </svg>
            </div>

            <div className="flex px-2 py-3">
              <div className="mx-3">
                <button
                  disabled={loadingMap[index]}
                  onClick={() => extractListData(list.id, index, list.name)}
                  className="hover:underline">{list.name}</button>
              {loadingMap[index] && (
                <div role="status">
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              </div>
            </div>
          </div>
          



          {list.reportsOpen && (
            <div className="flex p-5 md:p-0 w-full transform transition duration-500 ease-in-out border-b pb-10">
              <div style={{ marginLeft: '4rem', paddingBottom: '1rem', fontFamily: 'Verdana' }}>
                {/* <ListTasks lists={folderLists[folder.id] || []} /> */}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FoldersList;
