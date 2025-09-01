export default function Blog(props: { params: { id: string } }) {
  const { id } = props.params;

  console.log(id);

  return <div>Blog {id}</div>;
}
