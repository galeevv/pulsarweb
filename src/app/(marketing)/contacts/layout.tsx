import { PageHeader } from "@/components/shared/page-header"
import { Toaster } from "@/components/ui/sonner"

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader
        eyebrow="Контакты"
        title="Начнём с вашей задачи."
        description="Расскажите, что хотите сделать. Вместе определим, с чего начать и какой результат нужен вашему бизнесу."
      />
      {children}
      <Toaster
        theme="light"
        position="bottom-right"
        containerAriaLabel="Уведомления"
      />
    </>
  )
}
