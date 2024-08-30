function generateSharedToken(context, events, done) {
  context.vars.sharedToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXVpZCI6IjIxYWUzNjQxLTY4OTAtNDkyYy05ODYzLTk2OWRlN2Y4YjJlOSIsImlhdCI6MTcyNDk5NjEzNywiZXhwIjoxNzI1MDgyNTM3fQ.cFV2-b4ePktBwZvwrs3rEzvA0l4ObzNjnorWJ2Y87oY';
  return done();
}

function generateVUToken(context, events, done) {
  context.vars.vuToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXVpZCI6IjIxYWUzNjQxLTY4OTAtNDkyYy05ODYzLTk2OWRlN2Y4YjJlOSIsImlhdCI6MTcyNDk5NjEzNywiZXhwIjoxNzI1MDgyNTM3fQ.cFV2-b4ePktBwZvwrs3rEzvA0l4ObzNjnorWJ2Y87oY';
  return done();
}

module.exports = {
  generateSharedToken,
  generateVUToken,
};
