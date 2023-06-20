import React from 'react'

export default function listStuff() {
  return (
    <div>Dashboard</div>
  )
}

export async function getStaticProps() {
  const avatars = await fetch('https://last-airbender-api.herokuapp.com/api/v1/characters/avatar').then(res => res.json());
  console.log(avatars)
  return {
    props: {
      avatars
    }
  }
}
