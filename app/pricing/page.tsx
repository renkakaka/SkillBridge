"use client"

export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
// import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_PRICING_PLANS } from '@/lib/constants'
import { useTranslations } from '@/lib/useTranslations'
import { 
  Check, 
  X,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

const faqs = [
  {
    question: "Կարո՞ղ եմ փոխել իմ պլանը ցանկացած ժամանակ:",
    answer: "Այո, դուք կարող եք բարձրացնել կամ իջեցնել ձեր պլանը ցանկացած ժամանակ: Փոփոխությունները կհամամասնվեն ձեր ընթացիկ վճարման ցիկլի հիման վրա:"
  },
  {
    question: "Ի՞նչ, եթե չեմ աշխատանքի տեղավորվում 6 ամսվա ընթացքում:",
    answer: "Մեր Professional պլանը ներառում է աշխատանքի երաշխիք: Եթե չեք աշխատանքի տեղավորվում 6 ամսվա ընթացքում, մենք կվերադարձնենք ձեր բաժանորդագրությունը կամ կերկարաձգենք անվճար:"
  },
  {
    question: "Քանի՞ մենթորի սեսիա եմ ստանում:",
    answer: "Starter պլանը ներառում է հիմնական մենթորի համապատասխանություն: Accelerator-ը ներառում է 2 սեսիա/ամիս: Professional-ը ներառում է անսահմանափակ սեսիաներ:"
  },
  {
    question: "Կարո՞ղ եմ չեղարկել իմ բաժանորդագրությունը:",
    answer: "Այո, դուք կարող եք չեղարկել ձեր բաժանորդագրությունը ցանկացած ժամանակ: Դուք կշարունակեք մուտք ունենալ մինչև ձեր ընթացիկ վճարման ժամանակաշրջանի ավարտը:"
  },
  {
    question: "Ինչպիսի՞ նախագծեր են հասանելի:",
    answer: "Մենք առաջարկում ենք նախագծեր բոլոր հիմնական տեխնիկական ոլորտներում: վեբ մշակում, մոբայլ մշակում, UI/UX դիզայն, տվյալների գիտություն և այլն:"
  },
  {
    question: "Ինչպե՞ս եք համապատասխանեցնում ինձ մենթորների հետ:",
    answer: "Մենք օգտագործում ենք AI-ով աշխատող համապատասխանություն՝ հիմնված ձեր հմտությունների, նպատակների և փորձի մակարդակի վրա՝ կապելու ձեզ լավագույն մենթորների հետ:"
  }
]

export default function PricingPage() {
  const { t } = useTranslations()
  const [isAnnual, setIsAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('pricing.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('pricing.subtitle')}
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Ամսական
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Տարեկան
                <Badge variant="success" size="sm" className="ml-2">
                  Խնայեք 20%
                </Badge>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
            {MOCK_PRICING_PLANS.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'ring-2 ring-primary-500 shadow-xl' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="featured" size="lg">
                      Ամենահայտնի
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${isAnnual ? Math.round(plan.price * 0.8) : plan.price}
                    </span>
                    <span className="text-gray-600">/ամիս</span>
                  </div>
                  {isAnnual && plan.price > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Վճարվում է տարեկան (${Math.round(plan.price * 0.8 * 12)})
                    </p>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.popular ? "gradient" : "outline"} 
                    size="lg" 
                    className="w-full"
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Համեմատել հատկությունները
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Հատկություն</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Սկսնակ</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Արագացուցիչ</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Մասնագիտական</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Մուտք դեպի Bronze նախագծեր</td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Մուտք դեպի Silver նախագծեր</td>
                    <td className="py-4 px-6 text-center">
                      <X className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Մուտք դեպի Gold նախագծեր</td>
                    <td className="py-4 px-6 text-center">
                      <X className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <X className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Մենթորի սեսիաներ ամսական</td>
                    <td className="py-4 px-6 text-center text-gray-700">Հիմնական համապատասխանություն</td>
                    <td className="py-4 px-6 text-center text-gray-700">2 ներառված</td>
                    <td className="py-4 px-6 text-center text-gray-700">Անսահմանափակ</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Նախապատվության աջակցություն</td>
                    <td className="py-4 px-6 text-center">
                      <X className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Աշխատանքի երաշխիք</td>
                    <td className="py-4 px-6 text-center">
                      <X className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <X className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Հաճախակի տրվող հարցեր
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Պատրա՞ստ եք սկսել ձեր ճանապարհը:
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Միացեք հազարավոր մշակողների, դիզայներների և ստեղծագործների, ովքեր կառուցում են իրենց կարիերան
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Սկսել անվճար փորձնական ժամանակաշրջան
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
                Կապնվել վաճառքի հետ
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
