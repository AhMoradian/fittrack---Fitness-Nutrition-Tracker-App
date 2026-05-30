import { Download, Ruler, Settings, Target, UserRound, Weight } from 'lucide-react';
import { ScreenHeader } from '@/components/app-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adhdTips, profile, programRules } from '@/lib/sample-data';

const profileItems = [
  { label: 'Age', value: profile.age, icon: UserRound },
  { label: 'Height', value: profile.height, icon: Ruler },
  { label: 'Current Weight', value: profile.weight, icon: Weight },
  { label: 'Goal', value: profile.goal, icon: Target },
];

export default function ProfilePage() {
  return (
    <div>
      <ScreenHeader eyebrow="Profile" title="Your setup" subtitle="Profile and equipment now match the supplied home muscle-building program and stay ready for future AI coaching." />
      <section className="space-y-4 px-4 sm:px-5 md:px-8">
        <Card className="bg-slate-950 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-green-400 text-4xl">💪</div>
            <div><p className="text-sm font-black uppercase text-green-300">Home Muscle Building</p><h2 className="text-2xl font-black">Daily Builder</h2><p className="text-sm font-bold text-slate-300">Goal: {profile.weeklyGoal}. Add more calories if weight does not increase.</p></div>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {profileItems.map((item) => {
            const Icon = item.icon;
            return <Card key={item.label} className="p-4"><Icon className="h-6 w-6 text-green-600" /><p className="mt-3 text-xl font-black">{item.value}</p><p className="text-xs font-black uppercase text-muted-foreground">{item.label}</p></Card>;
          })}
        </div>
        <Card>
          <h2 className="text-xl font-black">Equipment</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.equipment.map((item) => <span key={item} className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">{item}</span>)}
          </div>
        </Card>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="text-xl font-black">Fast muscle-gain rules</h2>
            <div className="mt-4 space-y-3">
              {programRules.map((rule) => <div key={rule} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 font-bold"><Settings className="h-5 w-5 text-muted-foreground" />{rule}</div>)}
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-black">ADHD training tips</h2>
            <div className="mt-4 space-y-3">
              {adhdTips.map((tip) => <div key={tip} className="flex items-center gap-3 rounded-2xl bg-yellow-50 p-3 font-bold"><Settings className="h-5 w-5 text-yellow-600" />{tip}</div>)}
            </div>
          </Card>
        </div>
        <Button className="w-full" size="lg"><Download className="h-5 w-5" /> Export AI-ready data</Button>
      </section>
    </div>
  );
}
