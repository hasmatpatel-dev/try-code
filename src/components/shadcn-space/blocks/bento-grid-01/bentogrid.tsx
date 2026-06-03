import { Badge } from "@/components/ui/badge";
import ReminderAnimation from "@/components/shadcn-space/blocks/bento-grid-01/ReminderAnimation";
import AnimatedUiBlock from "@/components/shadcn-space/blocks/bento-grid-01/AnimatedUiBlock";

const Bentogrid = () => {
  return (
    <section>
      <div className="py-11 md:py-20">
        <div className="max-w-7xl xl:px-16 lg:px-8 px-4 mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-4 items-center justify-center max-w-3xl mx-auto">
            <Badge variant={"outline"} className="px-3 py-1 h-auto text-sm font-normal">
              Bento Grid Features
            </Badge>
            <h2 className="text-center md:text-5xl text-3xl mx-auto font-medium">
              AI coding platform built for learning web development
            </h2>
          </div>
          <div className="grid grid-cols-12 gap-5">
            <div className="lg:col-span-4 col-span-12 overflow-hidden">
              <div className="rounded-xl border border-border">
                <div className="bg-muted rounded-t-xl py-8 px-9 relative">
                  <ReminderAnimation />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border">
                  <h3 className="text-xl font-medium text-foreground">
                    Learn Next.js & React
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Hands-on coding lessons targeting the modern React ecosystem
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 col-span-12 overflow-hidden">
              <div className="rounded-xl border border-border">
                <div className="bg-muted rounded-t-xl py-7 lg:px-30 px-6 relative">
                  <AnimatedUiBlock />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border">
                  <h3 className="text-xl font-medium text-foreground">
                    Interactive Coding Practice
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Solve coding challenges online using our custom AI compiler and tutorial guide. Whether you are learning basic algorithms, full-stack frameworks, or databases.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 col-span-12 overflow-hidden">
              <div className="rounded-xl border border-border h-full flex flex-col">
                <div className="p-8 bg-muted rounded-t-xl flex-1 flex items-center justify-center">
                  <img
                    src="https://images.shadcnspace.com/assets/bento-grid/bento-grid-img-1.png"
                    alt="layout options"
                    className="dark:hidden"
                  />
                  <img
                    src="https://images.shadcnspace.com/assets/bento-grid/bento-grid-darkimg-1.png"
                    alt="layout options"
                    className="hidden dark:block"
                  />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border">
                  <h3 className="text-xl font-medium text-foreground">
                    Job-Ready Career Growth
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    We provide portfolio reviews and resume builders to land tech jobs fast.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 col-span-12 overflow-hidden">
              <div className="rounded-xl border border-border h-full flex flex-col">
                <div className="p-8 bg-muted rounded-t-xl flex-1 flex items-center justify-center">
                  <img
                    src="https://images.shadcnspace.com/assets/bento-grid/bento-grid-img-2.png"
                    alt="documentation"
                    className="dark:hidden"
                  />
                  <img
                    src="https://images.shadcnspace.com/assets/bento-grid/bento-grid-darkimg-2.png"
                    alt="documentation"
                    className="hidden dark:block"
                  />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border">
                  <h3 className="text-xl font-medium text-foreground">
                    Expert Mentors
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    A friendly and easy-to-reach developer community for your career.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 col-span-12 overflow-hidden">
              <div className="rounded-xl border border-border h-full flex flex-col">
                <div className="p-8 bg-muted rounded-t-xl flex-1 flex items-center justify-center relative">
                  <img
                    src="https://images.shadcnspace.com/assets/bento-grid/bento-grid-img-3.png"
                    alt="color options"
                  />
                </div>
                <div className="flex flex-col gap-0.5 p-8 border-t border-border">
                  <h3 className="text-xl font-medium text-foreground">
                    Flexible Study Plan
                  </h3>
                  <p className="text-base font-normal text-muted-foreground">
                    Self-paced learning plans to complete lessons according to your schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bentogrid;
