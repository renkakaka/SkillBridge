'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, Shield, Database, Bell, Globe, Users, Save, RefreshCw } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'SkillBridge',
    siteDescription: 'Կարիերայի զարգացման հարթակ',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerification: true,
    maxFileSize: '10',
    sessionTimeout: '24',
    defaultLanguage: 'hy',
    timezone: 'Asia/Yerevan',
    emailProvider: 'resend',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    security: {
      twoFactorAuth: false,
      passwordMinLength: '8',
      sessionMaxAge: '7',
      rateLimit: '100'
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Симулируем сохранение настроек
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Здесь будет API вызов для сохранения
  }

  const handleReset = () => {
    // Сброс к значениям по умолчанию
    setSettings({
      siteName: 'SkillBridge',
      siteDescription: 'Կարիերայի զարգացման հարթակ',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerification: true,
      maxFileSize: '10',
      sessionTimeout: '24',
      defaultLanguage: 'hy',
      timezone: 'Asia/Yerevan',
      emailProvider: 'resend',
      smtpHost: '',
      smtpPort: '587',
      smtpUser: '',
      smtpPassword: '',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      security: {
        twoFactorAuth: false,
        passwordMinLength: '8',
        sessionMaxAge: '7',
        rateLimit: '100'
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Համակարգի կարգավորումներ</h1>
        <p className="text-neutral-600">Կառավարեք հավելվածի հիմնական կարգավորումները</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Основные настройки */}
        <div className="lg:col-span-2 space-y-6">
          {/* Общие настройки */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Ընդհանուր կարգավորումներ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Կայքի անվանում</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Կայքի նկարագրություն</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultLanguage">Լռելյայն լեզու</Label>
                  <Select value={settings.defaultLanguage} onValueChange={(value) => setSettings({...settings, defaultLanguage: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hy">Հայերեն</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Ժամային գոտի</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Yerevan">Asia/Yerevan</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Սպասարկման ռեժիմ</Label>
                  <p className="text-sm text-neutral-600">Կայքը կլինի անհասանելի օգտատերերի համար</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Настройки безопасности */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Անվտանգություն
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passwordMinLength">Գաղտնաբառի նվազագույն երկարություն</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => setSettings({
                      ...settings, 
                      security: {...settings.security, passwordMinLength: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="sessionMaxAge">Սեսիայի առավելագույն տարիք (օր)</Label>
                  <Input
                    id="sessionMaxAge"
                    type="number"
                    value={settings.security.sessionMaxAge}
                    onChange={(e) => setSettings({
                      ...settings, 
                      security: {...settings.security, sessionMaxAge: e.target.value}
                    })}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">Երկու գործոնի իսկապահաստատում</Label>
                  <p className="text-sm text-neutral-600">Պահանջել 2FA բոլոր օգտատերերի համար</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    security: {...settings.security, twoFactorAuth: checked}
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Настройки уведомлений */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Ծանուցումներ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email ծանուցումներ</Label>
                  <p className="text-sm text-neutral-600">Ուղարկել ծանուցումներ email-ով</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, email: checked}
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push ծանուցումներ</Label>
                  <p className="text-sm text-neutral-600">Ուղարկել push ծանուցումներ</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, push: checked}
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Действия */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Գործողություններ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Պահպանել
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="w-full"
              >
                Վերակայել
              </Button>
            </CardContent>
          </Card>

          {/* Статистика системы */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Համակարգի վիճակ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Օգտատերեր</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Ակտիվ նախագծեր</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Մենթորներ</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Կայքի վերջին թարմացում</span>
                <span className="font-medium">2 ժամ առաջ</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
