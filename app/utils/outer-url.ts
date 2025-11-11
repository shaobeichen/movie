export default (value: string) => /http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(value)
