import { roomApi } from '../lib/api.js'

async function main(){
  try{
    const all = await roomApi.getAll()
    console.log('Total rooms:', Array.isArray(all) ? all.length : 'unknown')
    if(Array.isArray(all)){
      console.log(all.slice(-5))
    } else {
      console.log(all)
    }
  }catch(err){
    console.error('Error listing rooms:', err && err.message ? err.message : err)
    process.exitCode = 2
  }
}

main()
