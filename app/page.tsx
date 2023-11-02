"use client"

import Folders from '@/components/folders';
import { Button } from '@/components/ui/button';
import { Space, SpacesData } from '@/models/spaces';
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface SelectedId {
  id: string,
  selected: boolean,
}

export default function Home() {
  const [spaces, setSpaces] = useState<Array<Space>>([]);
  const [selectedIds, setSelectedIds] = useState<SelectedId[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    fetch("/api/spaces/get").then(async (data)=> {
      const spacesData: SpacesData = await data.json();
      setSpaces(spacesData.spaces);
    })
  }, [])
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/trajector.png"
          alt="Trajector Logo"
          width={180}
          height={40}
          priority
        />
      </div>

      <div className="flex items-center mb-32 grid text-center lg:w-full lg:mb-0 lg:text-left">
        <table className="hover:table-fixed border-collapse border border-slate-400 ">
          <thead>
            <tr>
              <th className='border border-slate-400'></th>
              <th className='border border-slate-400'>Name</th>
            </tr>
          </thead>
          <tbody>
            {
              spaces.map((space, i)=> {
                return (
                  <>
                    <tr key={i}>
                      <td>
                        <div className="flex items-center">
                          <input 
                            id="checked-checkbox" 
                            type="checkbox" 
                            onChange={(e)=>{
                              selectedIds[i] = {
                                selected: e.target.checked,
                                id: space.id
                              }
                              setSelectedIds(selectedIds)
                            }}
                            checked={selectedIds[space.id]}
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                      </td>
                      <td>{space.name}</td>
                    </tr>
                  </>
                )
              })
            }
          </tbody>
        </table>
        
        <Button 
          type="button"
          variant="outline"
          onClick={()=> {
            fetch("/api/export/run", {
              method: "post",
            })
          }}
          className="uppercase text-sm rounded-sm w-60 mt-2 lg:w-full" loading={loading}>
            Generate
        </Button>
      </div>
    </main>
  )
}
