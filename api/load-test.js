const { v4: uuidv4 } = require('uuid');

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

function generatePostData(context, events, done) {
  const uniqueId = uuidv4(); // UUID v4 ile benzersiz bir ID oluşturun

  // Rastgele alanlar üretme
  const title = `My First Post ${uniqueId}`;
  const content = `This is the content of my first post ${uniqueId}.`;
  const slug = `my-first-post-${uniqueId}`; // UUID'yi slug içinde kullanın

  // Veriyi context'e ekleyelim
  context.vars.title = title;
  context.vars.content = content;
  context.vars.slug = slug;
  context.vars.categoryId = 1; // Sabit kategori ID
  context.vars.tagIds = [1]; // Sabit tag ID
  context.vars.encrypted = true; // Sabit şifreleme durumu

  return done();
}

module.exports = {
  generateSharedToken,
  generateVUToken,
  generatePostData,
};
