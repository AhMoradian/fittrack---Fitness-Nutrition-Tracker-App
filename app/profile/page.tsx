import { Download, Ruler, Settings, Target, UserRound, Weight } from 'lucide-react';
import { ScreenHeader } from '@/components/app-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const profile = [
  { label: 'Age', value: '29', icon: UserRound },
  { label: 'Height', value: '178 cm', icon: Ruler },
  { label: 'Current Weight', value: '73.2 kg', icon: Weight },
  { label: 'Goal', value: 'Lean muscle gain', icon: Target },
];

export default function ProfilePage() {
  return (
    <div>
      <ScreenHeader eyebrow="Profile" title="Your setup" subtitle="Personal context, equipment, settings, and export tools are kept ready for future AI coaching without changing the core schema." />
      <section className="space-y-4 px-5 md:px-8">
        <Card className="bg-slate-950 text-white">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-green-400 text-4xl">🦉</div>
            <div><p className="text-sm font-black uppercase text-green-300">Level 12 Athlete</p><h2 className="text-2xl font-black">Daily Builder</h2><p className="text-sm font-bold text-slate-300">Consistency beats intensity.</p></div>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {profile.map((item) => {
            const Icon = item.icon;
            return <Card key={item.label} className="p-4"><Icon className="h-6 w-6 text-green-600" /><p className="mt-3 text-xl font-black">{item.value}</p><p className="text-xs font-black uppercase text-muted-foreground">{item.label}</p></Card>;
          })}
        </div>
        <Card>
          <h2 className="text-xl font-black">Equipment</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Pull-up bar', 'Adjustable dumbbells', 'Chair', 'Resistance bands', 'Yoga mat'].map((item) => <span key={item} className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">{item}</span>)}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Settings</h2>
          <div className="mt-4 space-y-3">
            {['Daily reminder at 7:00 AM', 'Successful day threshold: 70%', 'Progress photo reminder: weekly', 'Units: metric'].map((setting) => <div key={setting} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 font-bold"><Settings className="h-5 w-5 text-muted-foreground" />{setting}</div>)}
          </div>
        </Card>
        <Button className="w-full" size="lg"><Download className="h-5 w-5" /> Export AI-ready data</Button>
      </section>
    </div>
  );
}
