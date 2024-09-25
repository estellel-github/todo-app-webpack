function generateId() {
  let uuid = self.crypto.randomUUID();
  return Date.now() + "-" + uuid;
}

export { generateId };