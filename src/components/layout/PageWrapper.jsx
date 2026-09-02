import clsx from 'clsx'
export default function PageWrapper({ children, className }) { return <main className={clsx('min-h-screen bg-canvas', className)}>{children}</main> }
