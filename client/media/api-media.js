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

export { create };
