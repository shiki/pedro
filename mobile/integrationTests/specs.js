const SPECS = [require('./db.spec').default]

export default SPECS.map(spec => ({ name: spec.name, fn: spec })).filter(spec => spec.name.length > 0)
