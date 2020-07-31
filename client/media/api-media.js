const create = (params, credentials, media) => fetch(`/api/media/new/${params.userId}`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${credentials.t}`,
  },
  body: media,
})
  .then((response) => response.json())
  .catch((err) => {
    console.log(err);
  });

const listPopular = () => fetch('/api/media/popular', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .catch((err) => console.log(err));

const listByUser = (params) => fetch(`/api/media/by/${params.userId}`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .catch((err) => console.log(err));

export { create, listPopular, listByUser };
