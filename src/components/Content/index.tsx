interface IProps {
  filepath: string
}

export default ({ filepath }: IProps) => (
  <div className="content">文件路径：{filepath}</div>
)
