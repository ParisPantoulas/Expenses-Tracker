import { ref } from 'vue'

const getGroups = () => {

  const groups = ref([])
  const error = ref(null)

  const load = async () => {
    try {
      let data = await fetch('http://localhost:3000/groups')
      if(!data.ok) {
        throw Error('no available data')
      }
      groups.value = await data.json()
    }
    catch(err) {
      error.value = err.message
    }
  }

  return { groups, error, load }
}

export default getGroups
