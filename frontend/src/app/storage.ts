export function regionStorage(region_id: number){
   return  window.regions.find((i: { id: number, name: string }) => i.id === region_id);
}