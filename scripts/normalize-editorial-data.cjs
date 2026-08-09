const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const file=path.join(ROOT,'assets/editorial-data.json');
const data=JSON.parse(fs.readFileSync(file,'utf8'));

if(data.savings?.ldds && !data.savings.ldds.source && data.savings?.livretA?.source){
  data.savings.ldds.source=data.savings.livretA.source;
  data.savings.ldds.sourceNote='Le taux du LDDS est aligné sur celui du Livret A ; la même publication officielle est utilisée pour ce repère.';
}

if(data.tax2026 && !Array.isArray(data.tax2026.sources)){
  const sources=[];
  for(const key of ['pea','lifeInsurance','cto','per']){
    const source=data.tax2026[key]?.source;
    if(source&&!sources.includes(source))sources.push(source);
  }
  if(sources.length)data.tax2026.sources=sources;
}

fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
console.log('Référentiel éditorial normalisé.');
