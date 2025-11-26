
import { Search, Bell, User, Settings, Brain, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "Profile settings will be available soon!",
    });
  };

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 new price alerts!",
    });
  };

  return (
    <motion.header 
      className="relative backdrop-blur-md bg-white/10 dark:bg-black/20 border-b border-white/20 dark:border-white/10 text-foreground shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5" />
      
      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between p-4">
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.02 }}
        >
          <Button 
            variant="ghost" 
            className="text-foreground hover:bg-white/10 p-0 text-xl font-bold"
            onClick={() => navigate('/')}
          >
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                CryptoForecast Pro
              </span>
            </motion.div>
          </Button>
          <span className="text-sm opacity-80 hidden md:block">LSTM Predictions</span>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-2">
          {[
            { icon: Brain, label: "AI Models", path: "/ai-models" },
            { icon: TrendingUp, label: "Analysis", path: "/analysis" }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 transition-all duration-300"
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </motion.div>
            );
          })}
        </nav>
        
        <div className="flex items-center space-x-4">
          <motion.div 
            className="relative hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search cryptocurrencies..."
              className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-foreground placeholder:text-muted-foreground w-64 focus:bg-white/20 transition-all duration-300"
            />
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-foreground hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 rounded-full"
              onClick={handleNotificationClick}
            >
              <Bell className="w-5 h-5" />
            </Button>
          </motion.div>

          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 rounded-full">
                  <Settings className="w-5 h-5" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-md border-white/20">
              <DropdownMenuItem onClick={() => navigate('/ai-models')} className="hover:bg-white/10">
                <Brain className="w-4 h-4 mr-2" />
                AI Model Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Settings", description: "General settings coming soon!" })} className="hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                General Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-md border-white/20">
              <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-white/10">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Account", description: "Account settings coming soon!" })} className="hover:bg-white/10">
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Logout", description: "Logout functionality coming soon!" })} className="hover:bg-white/10">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
