function generateTaskId() {
  let uuid = self.crypto.randomUUID();
  return Date.now() + "-" + uuid;
}

export { generateTaskId };