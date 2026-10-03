import ProgrammeBreadcrumb from '../components/ProgrammeBreadcrumb';
import ProgrammeCTA from '../components/ProgrammeCTA';
import Logo from '../components/Logo';
import Reveal from '../components/Reveal';

const adultCourses = [
  'Piano',
  'Guitars',
  'Violin',
  'Drums',
  'Saxophone',
  'Trumpet',
  'Vocal',
];

const feePlans = [
  { label: 'Monthly plan', value: '50K' },
  { label: 'Two months - Basic Course', value: '90K' },
  { label: 'Four months - Merit Course', value: '150K' },
  { label: 'Six months - Master Course', value: '200K' },
  { label: 'Ten months - Pro Course', value: '400K' },
  { label: 'Eighteen months - Musicianship', value: '500K' },
];

const attendance = ['2 Class sessions per week.', '2 Hours daily'];

const courseIcons = [
  'bx-music',
  'bx-guitar',
  'bx-music',
  'bx-drum',
  'bx-music',
  'bx-music',
  'bx-microphone',
];

export default function AdultEducation() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <ProgrammeBreadcrumb current="Adult Education" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.5fr]">
          <Reveal variant="fade-up" delay={0.08} className="h-full">
            <div className="h-full rounded-[28px] border-4 border-cod-blue bg-white p-5 shadow-[0_8px_0_0_rgba(22,26,184,0.18)] md:p-7">
              <div className="rounded-[26px] border-[3px] border-cod-blue bg-cod-blue/10 p-5 text-center">
                <div className="mb-5 flex justify-center">
                  <div className="rounded-[28px] bg-white p-3 shadow-lg shadow-cod-blue/20">
                    <Logo className="h-28 w-28" />
                  </div>
                </div>

                <div className="text-2xl font-black uppercase tracking-tight text-cod-blue md:text-3xl">
                  <div>Clan of David</div>
                  <div className="text-pink-500">Art and Music Academy</div>
                </div>

                <div className="mt-4 inline-block rounded-full bg-cod-pink px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm">
                  Skillfully Educated
                </div>
              </div>

              <div className="mt-6 rounded-[24px] bg-cod-pink px-3 py-4 text-center text-2xl font-black uppercase text-white shadow-md shadow-pink-200 md:text-3xl">
                <span className="block">Clan of David</span>
                <span className="block">Art and Music Academy</span>
              </div>

              <div className="mt-8">
                <div className="mb-4 rounded-xl bg-cod-pink px-4 py-3 text-xl font-black uppercase text-white shadow-sm">
                  Available Choices
                </div>

                <div className="space-y-3">
                  {adultCourses.map((course, index) => (
                    <Reveal
                      key={course}
                      variant="fade-up"
                      delay={0.08 + index * 0.06}
                      as="div"
                    >
                      <div className="flex items-center justify-between rounded-2xl border border-cod-pink/30 bg-white px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cod-blue text-sm font-bold text-white">
                            {course.slice(0, 1)}
                          </span>
                          <span className="text-lg font-bold text-cod-blue-dark">
                            {course}
                          </span>
                        </div>
                        <span className="text-2xl text-cod-pink">
                          <i className={`bx ${courseIcons[index]}`} aria-hidden="true" />
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal variant="fade-up" delay={0.12}>
              <div className="rounded-[28px] border-4 border-cod-blue bg-white p-5 shadow-[0_8px_0_0_rgba(22,26,184,0.18)] md:p-6">
                <div className="mb-5 rounded-xl bg-cod-pink px-4 py-3 text-center text-2xl font-black uppercase text-white">
                  Adults Courses And Fees
                </div>

                <div className="space-y-4">
                  {feePlans.map((plan) => (
                    <div
                      key={plan.label}
                      className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 text-lg font-bold text-cod-blue-dark">
                        <span className="text-cod-pink">▶</span>
                        <span>{plan.label}</span>
                      </div>
                      <span className="text-2xl font-black text-cod-blue">
                        {plan.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border-2 border-cod-blue bg-cod-blue/5 p-4 text-center text-xl font-black text-cod-blue">
                  <i className="bx bx-calendar text-3xl" aria-hidden="true" />
                  <span>Maximum of 3 installments payment applicable.</span>
                </div>

                <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border-2 border-cod-pink bg-cod-pink/5 p-4 text-center text-lg font-bold text-cod-pink">
                  <i className="bx bx-briefcase text-2xl" aria-hidden="true" />
                  <span>School Account: 1219258176. Zenith bank.</span>
                </div>
              </div>
            </Reveal>

            <Reveal variant="fade-up" delay={0.18}>
              <div className="rounded-[28px] border-4 border-cod-blue bg-white p-5 shadow-[0_8px_0_0_rgba(22,26,184,0.18)] md:p-6">
                <div className="mb-5 rounded-xl bg-cod-blue px-4 py-3 text-center text-2xl font-black uppercase text-white">
                  Attendance:
                </div>

                <div className="space-y-5">
                  {attendance.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cod-pink text-2xl text-white">
                        {index === 0 ? (
                          <i className="bx bx-group" aria-hidden="true" />
                        ) : (
                          <i className="bx bx-time" aria-hidden="true" />
                        )}
                      </span>
                      <span className="text-2xl font-black text-cod-blue-dark">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-dashed border-slate-300 pt-5">
                  <div className="rounded-xl bg-cod-pink px-4 py-3 text-center text-2xl font-black uppercase text-white">
                    Choice of Days
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-3 rounded-2xl border border-cod-blue bg-cod-blue/5 p-4 text-center text-lg font-bold text-cod-blue">
                    <i className="bx bx-calendar-check text-3xl" aria-hidden="true" />
                    <span>Choose any two days between Monday to Saturday.</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal variant="fade-up" delay={0.24}>
          <div className="mt-8 rounded-[26px] border-4 border-cod-blue bg-gradient-to-r from-cod-pink to-cod-pink/90 p-4 shadow-[0_8px_0_0_rgba(22,26,184,0.18)] md:p-6">
            <div className="flex flex-col items-center justify-center gap-2 text-center text-white">
              <div className="flex items-center gap-4 text-2xl font-black uppercase tracking-tight md:text-4xl">
                <span className="text-4xl">♪</span>
                <span>Learn. Practice. Perform. Excel.</span>
                <span className="text-4xl">♪</span>
              </div>
              <div className="text-xl font-extrabold uppercase md:text-2xl">
                Your journey to musical excellence starts here!
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10">
          <ProgrammeCTA
            heading="Choose an adult music path that fits your schedule."
            subtext="Join our adult music programme and build confidence, skill, and consistency with flexible weekly sessions."
          />
        </div>
      </div>
    </div>
  );
}
