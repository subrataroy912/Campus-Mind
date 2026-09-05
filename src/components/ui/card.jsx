import { cn } from '../../lib/utils.js'

function Card({ className, ...props }) { return <section className={cn('rounded-xl border border-border bg-surface text-text-main shadow-sm', className)} {...props} /> }
function CardHeader({ className, ...props }) { return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} /> }
function CardTitle({ className, ...props }) { return <h2 className={cn('text-lg font-semibold leading-none tracking-tight text-text-heading', className)} {...props} /> }
function CardDescription({ className, ...props }) { return <p className={cn('text-sm text-text-muted', className)} {...props} /> }
function CardContent({ className, ...props }) { return <div className={cn('p-6 pt-0', className)} {...props} /> }
function CardFooter({ className, ...props }) { return <div className={cn('flex items-center p-6 pt-0', className)} {...props} /> }

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
