#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTI18nUtil.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTLinkingManager.h>
#import "RNBootSplash.h"
#import <Firebase.h>


@import Firebase;

// #if DEBUG && TARGET_OS_SIMULATOR
// #import <FlipperKit/FlipperClient.h>
// #import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
// #import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
// #import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
// #import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
// #import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
//
// @import GoogleMaps;
//
// static void InitializeFlipper(UIApplication *application) {
//   FlipperClient *client = [FlipperClient sharedClient];
//   SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
//   [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
//   [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
//   [client addPlugin:[FlipperKitReactPlugin new]];
//   [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
//   [client start];
// }
// #endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
//#if DEBUG && TARGET_OS_SIMULATOR
//  #ifdef FB_SONARKIT_ENABLED
//  InitializeFlipper(application);
//#endif
//#endif
  

  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
  
  [GMSServices provideAPIKey:@"AIzaSyC6E-iEcPeohwZXXMtSQCRDhpwDmoTIcTo"];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"homzhub"
                                            initialProperties:nil];
 [[RCTI18nUtil sharedInstance] allowRTL:YES];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  NSString *bootSplash = [self getStoryBoardNameInApp];
  [RNBootSplash initWithStoryboard:bootSplash rootView:rootView];
  return YES;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {



    BOOL handledFB = [[FBSDKApplicationDelegate sharedInstance] application:application
      openURL:url
      sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
      annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
    ];
    
    BOOL handledDeepLink = [RCTLinkingManager application:application openURL:url options:options];

    return handledDeepLink || handledFB;
  }

- (NSString *)getStoryBoardNameInApp {
  
  NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
  if([bundleIdentifier isEqualToString:@"com.homzhub.partner"]) {
    return @"LaunchScreenPartner";
  }
  else {
    return @"LaunchScreenHomzhub";
  }
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"packages/mobile/index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
