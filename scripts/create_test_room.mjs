import { roomApi } from '../lib/api.js'

async function main(){
  try{
    const timestamp = Date.now()
    const payload = {
      name: `TEST ROOM ${timestamp}`,
      type: 'Test',
      price: 1000000,
      basePriceVnd: 1000000,
      image: '',
      description: 'Created by automated test script',
      capacity: 2,
      status: 'available',
    }

    console.log('Creating room...')
    const created = await roomApi.create(payload)
    console.log('Created:', created)

    console.log('\nFetching all rooms...')
    const all = await roomApi.getAll()
    console.log('Total rooms:', Array.isArray(all) ? all.length : 'unknown')
    if(Array.isArray(all)){
      const found = all.find(r => r.id === created.id || r.name === payload.name)
      console.log('Found created in list:', Boolean(found))
    }
  }catch(err){
    console.error('Error:', err && err.message ? err.message : err)
    process.exitCode = 2
  }
}

main()
