function removePassowrd(data) {
  if (data) {
    const { password, ...rest } = data;
    return rest;
  }
  return data;
}

export default removePassowrd;
