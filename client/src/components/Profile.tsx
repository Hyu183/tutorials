import { useHelloQuery } from '../generated/graphql'


const Profile = () => {
    const {data,loading,error} = useHelloQuery({fetchPolicy: 'no-cache'});
    if(loading) return <h1>Loading...</h1>
    if(error) return <h1 style={{color: 'red'}}>Error: {JSON.stringify(error)}</h1>
  return (
    <h1>{data?.hello}</h1>
  )
}

export default Profile