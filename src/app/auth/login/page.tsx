'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Zap, Users, Layout, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast-wrapper'

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Verification code sent!')
      router.push('/auth/verify')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#303F9F] via-[#3949AB] to-[#5C6BC0] overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 flex items-center justify-center min-h-screen p-4"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <div className="w-full max-w-md">
          <motion.div 
            className="backdrop-blur-xl bg-white/15 rounded-2xl shadow-2xl p-8 border border-white/20"
            variants={fadeInUp}
          >
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <div className="mb-4 flex items-center justify-center">
                <h1 className="text-6xl font-cursive whitespace-nowrap">
                  <span className="logo-first-letter logo-color">F</span><span className="logo-color">reeflow</span>
                </h1>
              </div>
              <p className="text-white/80 flex items-center justify-center gap-1">
                Create intelligent flowcharts with AI
                <Zap className="w-4 h-4 text-yellow-300" />
              </p>
            </motion.div>

            <motion.form 
              variants={fadeInUp}
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">
                  Email address
                </label>
                <input
                  {...form.register('email')}
                  type="email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#9FA8DA] focus:border-transparent text-white placeholder-white/50 backdrop-blur-sm transition-all"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="text-red-300 text-sm">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#7986CB] to-[#9FA8DA] text-white py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm border border-white/10 font-medium"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Continue with Email'
                )}
              </button>
            </motion.form>

            <motion.div 
              variants={fadeInUp}
              className="mt-8 grid grid-cols-3 gap-4 text-center"
            >
              <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all transform hover:scale-[1.02]">
                <Zap className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
                <h3 className="font-medium text-white text-sm">AI-Powered</h3>
              </div>
              <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all transform hover:scale-[1.02]">
                <Users className="w-6 h-6 text-sky-300 mx-auto mb-2" />
                <h3 className="font-medium text-white text-sm">Collaborative</h3>
              </div>
              <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all transform hover:scale-[1.02]">
                <Layout className="w-6 h-6 text-purple-200 mx-auto mb-2" />
                <h3 className="font-medium text-white text-sm">Templates</h3>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 