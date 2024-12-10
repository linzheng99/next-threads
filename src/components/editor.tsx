'use client'

import 'quill/dist/quill.snow.css'

import { ImageIcon, Smile } from 'lucide-react'
import Quill, { type Delta, type Op, type QuillOptions } from 'quill'
import { type MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MdSend } from 'react-icons/md'
import { PiTextAa } from 'react-icons/pi'

import { cn } from '@/lib/utils'

import EmojiPopover from './emoji-popover'
import Hint from './hint'
import { Button } from './ui/button'

type EditorValue = {
  image: File | null
  body: string
}

interface EditorProps {
  variant?: 'create' | 'update'
  onSubmit: ({ image, body }: EditorValue) => void
  onCancel?: () => void
  placeholder?: string
  defaultValue?: Delta | Op[]
  disabled?: boolean
  innerRef?: MutableRefObject<Quill | null>
}

const Editor = ({
  variant = 'create',
  onSubmit,
  onCancel,
  placeholder = 'Write something...',
  defaultValue = [],
  disabled = false,
  innerRef
}: EditorProps) => {
  const [text, setText] = useState('')
  const [isToolbarVisible, setIsToolbarVisible] = useState(true)

  // Quill 容器
  const containerRef = useRef<HTMLDivElement>(null)
  // 保持获取传入的最新 onSubmit
  const submitRef = useRef(onSubmit)
  // 保持获取传入的最新 placeholder
  const placeholderRef = useRef(placeholder)
  // Quill 实例
  const quillRef = useRef<Quill | null>(null)
  // 保持获取传入的最新 defaultValue
  const defaultValueRef = useRef(defaultValue)
  // 保持获取传入的最新 disabled
  const disabledRef = useRef(disabled)

  // 同步更新所有 ref 的值
  // 使用 useLayoutEffect 确保在 DOM 更新前同步执行
  useLayoutEffect(() => {
    submitRef.current = onSubmit
    placeholderRef.current = placeholder
    defaultValueRef.current = defaultValue
    disabledRef.current = disabled
  })

  useEffect(() => {
    if (!containerRef.current) return

    // 创建 Quill 容器
    const container = containerRef.current
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div')
    )

    // 设置 Quill 选项
    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike'],
          ['link'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                console.log('enter')
              },
            },
            shiftEnter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n')
              },
            },
          },
        },
      },
    }

    // 创建 Quill 实例
    const quill = new Quill(editorContainer, options)
    // 让其他地方可以调用这个实例，避免 useEffect 作用域问题
    quillRef.current = quill
    quillRef.current.focus()

    // 如果提供了 innerRef，同步更新父组件的引用
    if (innerRef) {
      innerRef.current = quill
    }

    // 设置初始内容
    quill.setContents(defaultValueRef.current)
    setText(quill.getText())

    // 监听文本变化
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE)

      if (container) {
        container.innerHTML = ''
      }
      if (quillRef.current) {
        quillRef.current = null
      }
      if (innerRef) {
        innerRef.current = null
      }
    }
  }, [innerRef])

  const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim() === ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current

    if (quill) {
      quill.insertText(quill.getSelection()?.index || 0, emoji.native)
    }
  }

  function toggleToolbar() {
    setIsToolbarVisible(prev => !prev)
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar')

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden')
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className='h-full min-h-[120px] ql-custom'></div>
        <div className='flex px-2 pb-2 z-[5]'>
          <Hint label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}>
            <Button disabled={disabled} size="iconSm" variant="ghost" onClick={toggleToolbar}>
              <PiTextAa className='size-4' />
            </Button>
          </Hint>
          <EmojiPopover hint='Emoji' onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size="iconSm" variant="ghost" onClick={() => { }}>
              <Smile className='size-4' />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label='Image'>
              <Button disabled={disabled} size="iconSm" variant="ghost" onClick={() => { }}>
                <ImageIcon className='size-4' />
              </Button>
            </Hint>
          )}
          {variant === 'update' && (
            <div className='flex gap-2 ml-auto'>
              <Button
                disabled={disabled}
                size="sm"
                variant="outline"
                onClick={() => { }}
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                size="sm"
                variant="ghost"
                className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white hover:text-white"
                onClick={() => { }}
              >
                Save
              </Button>
            </div>
          )}
          {variant === 'create' && (
            <Button
              disabled={disabled || isEmpty}
              size="iconSm"
              variant="ghost"
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'bg-white hover:bg-white text-muted-foreground'
                  : 'bg-[#007a5a] hover:bg-[#007a5a]/80 text-white hover:text-white'
              )}
              onClick={() => { }}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div className={cn(
          'p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition',
          !isEmpty && 'opacity-100'
        )}>
          <p>
            <strong>Shit + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
}

export default Editor;
