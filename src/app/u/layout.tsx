type Props = {
  children: React.ReactNode
}

const layout = ({children}: Props) => {
  return (
    <div className="w-full h-screen bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
        {children}
    </div>
  )
}

export default layout