'use client'

import Link from 'next/link'
import { Sparkles, Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { useTranslations } from '@/lib/useTranslations'

export default function Footer() {
  const { t } = useTranslations()
  
  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="text-white h-6 w-6" />
              </div>
              <span className="font-bold text-2xl text-white">SkillBridge</span>
            </div>
            <p className="text-neutral-300 text-lg mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-primary-600 transition-all duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-primary-600 transition-all duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-primary-600 transition-all duration-200">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-primary-600 transition-all duration-200">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t('footer.links.resources')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/projects" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  {t('navigation.projects')}
                </Link>
              </li>
              <li>
                <Link href="/mentors" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  {t('navigation.mentors')}
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  {t('navigation.successStories')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  {t('navigation.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t('footer.links.help')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  {t('footer.links.help')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  {t('footer.links.contact')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  {t('footer.links.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-neutral-700 pt-8 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Բաժանորդագրվել նորություններին</h3>
            <p className="text-neutral-300 mb-4">Ստացեք վերջին թարմացումները և նոր հնարավորությունները</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ձեր email-ը"
                className="flex-1 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-primary text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                Բաժանորդագրվել
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-neutral-400 text-sm mb-4 md:mb-0">
            {t('footer.copyright')}
          </div>
          <div className="flex items-center space-x-2 text-neutral-400 text-sm">
            <span>Ստեղծված</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>կարիերայի զարգացման համար</span>
          </div>
        </div>
      </div>
    </footer>
  )
}


