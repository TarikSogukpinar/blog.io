function generateSharedToken(context, events, done) {
  context.vars.sharedToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXVpZCI6IjIxYWUzNjQxLTY4OTAtNDkyYy05ODYzLTk2OWRlN2Y4YjJlOSIsImlhdCI6MTcyNDY2Njc1NSwiZXhwIjoxNzI0NzUzMTU1fQ.KIK6WXFmxzq8el1pJF6WQD8nkY5aDENSxme4QbkeJbA';
  return done();
}

function generateVUToken(context, events, done) {
  context.vars.vuToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXVpZCI6IjIxYWUzNjQxLTY4OTAtNDkyYy05ODYzLTk2OWRlN2Y4YjJlOSIsImlhdCI6MTcyNDY2Njc1NSwiZXhwIjoxNzI0NzUzMTU1fQ.KIK6WXFmxzq8el1pJF6WQD8nkY5aDENSxme4QbkeJbA';
  return done();
}

module.exports = {
  generateSharedToken,
  generateVUToken,
};
